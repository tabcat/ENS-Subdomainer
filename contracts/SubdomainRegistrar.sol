pragma solidity ^0.4.25;

import "./ENS.sol";
import "./Resolver.sol";
import "./SubdomainInterface.sol";
import "./HashRegistrarSimplified.sol";

/**
 * !!!
 *
 * this is a modified version of the SubdomainRegistrar.sol contract from:
 * https://github.com/ensdomains/subdomain-registrar/blob/master/contracts/SubdomainRegistrar.sol
 *
 * all rent properties removed
 * all warnings for compiler version 0.4.25 fixed
 *  -changed name param to label (hash of name) in buyer functions already only using hashed name
 *  -added emit prefix to event triggers
 *
 */

/**
 * @dev Implements an ENS registrar that sells subdomains on behalf of their owners.
 *
 * Users may register a subdomain by calling `register` with the name of the domain
 * they wish to register under, and the label hash of the subdomain they want to
 * register. They must also specify the new owner of the domain, and the referrer,
 * who is paid an optional finder's fee. The registrar then configures a simple
 * default resolver, which resolves `addr` lookups to the new owner, and sets
 * the `owner` account as the owner of the subdomain in ENS.
 *
 * New domains may be added by calling `configureDomain`, then transferring
 * ownership in the ENS registry to this contract. Ownership in the contract
 * may be transferred using `transfer`, and a domain may be unlisted for sale
 * using `unlistDomain`. There is (deliberately) no way to recover ownership
 * in ENS once the name is transferred to this registrar.
 *
 * Critically, this contract does not check one key property of a listed domain:
 *
 * - Is the name UTS46 normalised?
 *
 * User applications MUST check these two elements for each domain before
 * offering them to users for registration.
 *
 * Applications should additionally check that the domains they are offering to
 * register are controlled by this registrar, since calls to `register` will
 * fail if this is not the case.
 */
contract SubdomainRegistrar is SubdomainInterface {

    // namehash('eth')
    bytes32 constant public TLD_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;

    bool public stopped = false;
    address public registrarOwner;
    address public migration;

    ENS public ens;
    HashRegistrarSimplified public hashRegistrar;

    struct Domain {
        string name;
        address owner;
        address transferAddress;
        uint price;
        uint referralFeePPM;
    }

    mapping (bytes32 => Domain) domains;

    modifier new_registrar() {
        require(ens.owner(TLD_NODE) != address(hashRegistrar));
        _;
    }

    modifier owner_only(bytes32 label) {
        require(owner(label) == msg.sender);
        _;
    }

    modifier not_stopped() {
        require(!stopped);
        _;
    }

    modifier registrar_owner_only() {
        require(msg.sender == registrarOwner);
        _;
    }

    event TransferAddressSet(bytes32 indexed label, address addr);
    event DomainTransferred(bytes32 indexed label, string name);

    constructor(ENS _ens) public {
        ens = _ens;
        hashRegistrar = HashRegistrarSimplified(ens.owner(TLD_NODE));
        registrarOwner = msg.sender;
    }

    /**
     * @dev owner returns the address of the account that controls a domain.
     *      Initially this is a null address. If the name has been
     *      transferred to this contract, then the internal mapping is consulted
     *      to determine who controls it. If the owner is not set,
     *      the previous owner of the deed is returned.
     * @param label The label hash of the deed to check.
     * @return The address owning the deed.
     */
    function owner(bytes32 label) public view returns (address) {

        if (domains[label].owner != 0x0) {
            return domains[label].owner;
        }

        Deed domainDeed = deed(label);
        if (domainDeed.owner() != address(this)) {
            return 0x0;
        }

        return domainDeed.previousOwner();
    }

    /**
     * @dev Transfers internal control of a label to a new account. Does not update
     *      ENS.
     * @param label The keccak256 hash of the name.
     * @param newOwner The address of the new owner.
     */
    function transfer(bytes32 label, address newOwner) public owner_only(label) {
        emit OwnerChanged(label, domains[label].owner, newOwner);
        domains[label].owner = newOwner;
    }

    /**
     * @dev Sets the resolver record for a label in ENS.
     * @param label The label to set the resolver for.
     * @param resolver The address of the resolver
     */
    function setResolver(bytes32 label, address resolver) public owner_only(label) {
        bytes32 node = keccak256(TLD_NODE, label);
        ens.setResolver(node, resolver);
    }

    /**
     * @dev Configures a domain for sale.
     * @param name The name to configure.
     * @param price The price in wei to charge for subdomain registrations
     * @param referralFeePPM The referral fee to offer, in parts per million
     */
    function configureDomain(string name, uint price, uint referralFeePPM) public {
        configureDomainFor(name, price, referralFeePPM, msg.sender, 0x0);
    }

    /**
     * @dev Configures a domain, optionally transferring it to a new owner.
     * @param name The name to configure.
     * @param price The price in wei to charge for subdomain registrations.
     * @param referralFeePPM The referral fee to offer, in parts per million.
     * @param _owner The address to assign ownership of this domain to.
     * @param _transfer The address to set as the transfer address for the name
     *        when the permanent registrar is replaced. Can only be set to a non-zero
     *        value once.
     */
    function configureDomainFor(string name, uint price, uint referralFeePPM, address _owner, address _transfer) public owner_only(keccak256(name)) {
        bytes32 label = keccak256(name);
        Domain storage domain = domains[label];

        // Don't allow changing the transfer address once set. Treat 0 as "don't change" for convenience.
        require(domain.transferAddress == 0 || _transfer == 0 || domain.transferAddress == _transfer);

        if (domain.owner != _owner) {
            domain.owner = _owner;
        }

        if (keccak256(domain.name) != label) {
            // New listing
            domain.name = name;
        }

        domain.price = price;
        domain.referralFeePPM = referralFeePPM;

        if (domain.transferAddress != _transfer && _transfer != 0) {
            domain.transferAddress = _transfer;
            emit TransferAddressSet(label, _transfer);
        }

        emit DomainConfigured(label);
    }

    /**
     * @dev Sets the transfer address of a domain for after an ENS update.
     * @param label The label for which to set the transfer address.
     * @param transferee The address to transfer to.
     */
    function setTransferAddress(bytes32 label, address transferee) public owner_only(label) {
        Domain storage domain = domains[label];

        require(domain.transferAddress == 0x0);

        domain.transferAddress = transferee;
        emit TransferAddressSet(label, transferee);
    }

    /**
     * @dev Unlists a domain
     * May only be called by the owner.
     * @param label The label of the domain to unlist.
     */
    function unlistDomain(bytes32 label) public owner_only(label) {
        Domain storage domain = domains[label];
        emit DomainUnlisted(label);

        domain.name = '';
        domain.owner = owner(label);
        domain.price = 0;
        domain.referralFeePPM = 0;
    }

    /**
     * @dev Returns information about a subdomain.
     * @param label The label hash for the domain.
     * @param subdomain The label for the subdomain.
     * @return domain The name of the domain, or an empty string if the subdomain
     *                is unavailable.
     * @return price The price to register a subdomain, in wei.
     * @return referralFeePPM The referral fee for the dapp, in ppm.
     */
    function query(bytes32 label, string subdomain) public view returns (string domain, uint price, uint referralFeePPM) {
        bytes32 node = keccak256(TLD_NODE, label);
        bytes32 _label = keccak256(subdomain);
        bytes32 subnode = keccak256(node, _label);

        if (ens.owner(subnode) != 0) {
            return ('', 0, 0);
        }

        Domain memory data = domains[label];
        return (data.name, data.price, data.referralFeePPM);
    }

    /**
     * @dev Registers a subdomain.
     * @param label The label hash of the domain to register a subdomain of.
     * @param subdomain The desired subdomain label.
     * @param subdomainOwner The account that should own the newly configured subdomain.
     * @param referrer The address of the account to receive the referral fee.
     */
    function register(bytes32 label, string subdomain, address subdomainOwner, address referrer, address resolver) public not_stopped payable {
        bytes32 domainNode = keccak256(TLD_NODE, label);
        bytes32 subdomainLabel = keccak256(subdomain);

        // Subdomain must not be registered already.
        require(ens.owner(keccak256(domainNode, subdomainLabel)) == address(0));

        Domain storage domain = domains[label];

        // Domain must be available for registration
        require(keccak256(domain.name) == label);

        // User must have paid enough
        require(msg.value >= domain.price);

        // Send any extra back
        if (msg.value > domain.price) {
            msg.sender.transfer(msg.value - domain.price);
        }

        // Send any referral fee
        uint256 total = domain.price;
        if (domain.referralFeePPM * domain.price > 0 && referrer != 0 && referrer != domain.owner) {
            uint256 referralFee = (domain.price * domain.referralFeePPM) / 1000000;
            referrer.transfer(referralFee);
            total -= referralFee;
        }

        // Send the registration fee
        if (total > 0) {
            domain.owner.transfer(total);
        }

        // Register the domain
        if (subdomainOwner == 0) {
            subdomainOwner = msg.sender;
        }
        doRegistration(domainNode, subdomainLabel, subdomainOwner, Resolver(resolver));

        emit NewRegistration(label, subdomain, subdomainOwner, referrer, domain.price);
    }

    function doRegistration(bytes32 node, bytes32 label, address subdomainOwner, Resolver resolver) internal {
        // Get the subdomain so we can configure it
        ens.setSubnodeOwner(node, label, this);

        bytes32 subnode = keccak256(node, label);
        // Set the subdomain's resolver
        ens.setResolver(subnode, resolver);

        // Set the address record on the resolver
        resolver.setAddr(subnode, subdomainOwner);

        // Pass ownership of the new subdomain to the registrant
        ens.setOwner(subnode, subdomainOwner);
    }

    // function supportsInterface(bytes4 interfaceID) public pure returns (bool) {
    //     return (
    //         (interfaceID == 0x01ffc9a7) // supportsInterface(bytes4)
    //         || (interfaceID == 0xc1b15f5a) // RegistrarInterface
    //     );
    // }

    // function rentDue(bytes32 label, string subdomain) public view returns (uint timestamp) {
    //     return 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    // }

    /**
     * @dev Upgrades the domain to a new registrar.
     * @param name The name of the domain to transfer.
     */
    function upgrade(string name) public owner_only(keccak256(name)) new_registrar {
        bytes32 label = keccak256(name);
        address transferee = domains[label].transferAddress;

        require(transferee != 0x0);

        delete domains[label];

        hashRegistrar.transfer(label, transferee);
        emit DomainTransferred(label, name);
    }


    /**
     * @dev Stops the registrar, disabling configuring of new domains.
     */
    function stop() public not_stopped registrar_owner_only {
        stopped = true;
    }

    /**
     * @dev Sets the address where domains are migrated to.
     * @param _migration Address of the new registrar.
     */
    function setMigrationAddress(address _migration) public registrar_owner_only {
        require(stopped);
        migration = _migration;
    }

    /**
     * @dev Migrates the domain to a new registrar.
     * @param name The name of the domain to migrate.
     */
    function migrate(string name) public owner_only(keccak256(name)) {
        require(stopped);
        require(migration != 0x0);

        bytes32 label = keccak256(name);
        Domain storage domain = domains[label];

        hashRegistrar.transfer(label, migration);

        SubdomainRegistrar(migration).configureDomainFor(
            domain.name,
            domain.price,
            domain.referralFeePPM,
            domain.owner,
            domain.transferAddress
        );

        delete domains[label];

        emit DomainTransferred(label, name);
    }

    function transferOwnership(address newOwner) public registrar_owner_only {
        registrarOwner = newOwner;
    }

    // function payRent(bytes32 label, string subdomain) public payable {
    //     revert();
    // }

    function deed(bytes32 label) internal view returns (Deed) {
        address deedAddress;
        (,deedAddress,,,) = hashRegistrar.entries(label);
        return Deed(deedAddress);
    }
}
