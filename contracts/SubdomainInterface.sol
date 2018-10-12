pragma solidity ^0.4.17;

contract SubdomainInterface {
    event OwnerChanged(bytes32 indexed label, address indexed oldOwner, address indexed newOwner);
    event DomainConfigured(bytes32 indexed label);
    event DomainUnlisted(bytes32 indexed label);
    event NewRegistration(bytes32 indexed label, string subdomain, address indexed owner, address indexed referrer, uint price);

    // InterfaceID of these four methods is 0xc1b15f5a
    function query(bytes32 label, string subdomain) public view returns (string domain, uint signupFee, uint referralFeePPM);
    function register(bytes32 label, string subdomain, address owner, address referrer, address resolver) public payable;

}
