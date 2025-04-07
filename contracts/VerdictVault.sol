// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerdictVault {
    struct Verdict {
        string ipfsHash;
        string caseID;
        uint256 timestamp;
        address uploader;
    }

    mapping(string => Verdict) private verdicts;

    event VerdictStored(string indexed caseID, string ipfsHash, uint256 timestamp, address indexed uploader);

    function storeVerdict(string memory _caseID, string memory _ipfsHash) public {
        require(bytes(verdicts[_caseID].caseID).length == 0, "Verdict already exists for this case.");
        verdicts[_caseID] = Verdict(_ipfsHash, _caseID, block.timestamp, msg.sender);
        emit VerdictStored(_caseID, _ipfsHash, block.timestamp, msg.sender);
    }

    function getVerdict(string memory _caseID) public view returns (string memory ipfsHash, uint256 timestamp, address uploader) {
        require(bytes(verdicts[_caseID].caseID).length != 0, "No verdict found for this case.");
        Verdict memory verdict = verdicts[_caseID];
        return (verdict.ipfsHash, verdict.timestamp, verdict.uploader);
    }
}
