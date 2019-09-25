import { VirtualMachine } from "@azure/arm-compute/esm/models";
import {
  NetworkInterface,
  PublicIPAddress,
} from "@azure/arm-network/esm/models";
import { RelationshipDirection } from "@jupiterone/jupiter-managed-integration-sdk";

import { Group, GroupMember } from "../azure";
import {
  AccountEntity,
  GroupMemberRelationship,
  VirtualMachineNetworkInterfaceRelationship,
  VirtualMachinePublicIPAddressRelationship,
} from "../jupiterone";
import {
  createAccountGroupRelationship,
  createAccountUserRelationship,
  createGroupMemberRelationship,
  createVirtualMachineNetworkInterfaceRelationship,
  createVirtualMachinePublicIPAddressRelationship,
} from "./relationships";

const account = {
  _class: "Account",
  _key: "azure_account_id",
  _type: "azure_account",
  displayName: "name",
} as AccountEntity;

describe("createAccountGroupRelationship", () => {
  test("properties transferred", () => {
    expect(
      createAccountGroupRelationship(account, {
        id: "89fac263-2430-48fd-9278-dacfdfc89792",
        deletedDateTime: undefined,
        classification: undefined,
        createdDateTime: "2019-04-23T18:06:05Z",
        description: "descr",
        displayName: "test group",
        groupTypes: [],
        mail: undefined,
        mailEnabled: false,
        mailNickname: "8bb2d1c34",
        onPremisesLastSyncDateTime: undefined,
        onPremisesSecurityIdentifier: undefined,
        onPremisesSyncEnabled: undefined,
        proxyAddresses: [],
        renewedDateTime: "2019-04-23T18:06:05Z",
        securityEnabled: true,
        visibility: undefined,
        onPremisesProvisioningErrors: [],
      }),
    ).toEqual({
      _class: "HAS",
      _fromEntityKey: "azure_account_id",
      _key:
        "azure_account_id_azure_user_group_89fac263-2430-48fd-9278-dacfdfc89792",
      _toEntityKey: "azure_user_group_89fac263-2430-48fd-9278-dacfdfc89792",
      _type: "azure_account_has_group",
    });
  });
});

describe("createAccountUserRelationship", () => {
  test("properties transferred", () => {
    expect(
      createAccountUserRelationship(account, {
        businessPhones: ["+1 2223334444"],
        displayName: "Andrew Kulakov",
        givenName: "Andrew",
        jobTitle: "test title",
        mail: undefined,
        mobilePhone: "+1 2223334444",
        officeLocation: "DBP",
        preferredLanguage: undefined,
        surname: "Kulakov",
        userPrincipalName:
          "admin_test.dualboot.com#EXT#@admintestdualboot.onmicrosoft.com",
        id: "abf00eda-02d6-4053-a077-eef036e1a4c8",
      }),
    ).toEqual({
      _class: "HAS",
      _fromEntityKey: "azure_account_id",
      _key: "azure_account_id_azure_user_abf00eda-02d6-4053-a077-eef036e1a4c8",
      _toEntityKey: "azure_user_abf00eda-02d6-4053-a077-eef036e1a4c8",
      _type: "azure_account_has_user",
    });
  });
});

describe("createGroupMemberRelationship", () => {
  const group: Group = {
    id: "89fac263-2430-48fd-9278-dacfdfc89792",
  };

  test("properties transferred for users", () => {
    const member: GroupMember = {
      "@odata.type": "#microsoft.graph.user",
      id: "324e8daa-9c29-42a4-a74b-b9893e6d9750",
      displayName: "User Name",
      jobTitle: "Job Title",
      mail: "user@example.com",
    };

    const relationship: GroupMemberRelationship = {
      _class: "HAS",
      _key:
        "azure_user_group_89fac263-2430-48fd-9278-dacfdfc89792_azure_user_324e8daa-9c29-42a4-a74b-b9893e6d9750",
      _type: "azure_group_has_member",
      _mapping: {
        relationshipDirection: RelationshipDirection.FORWARD,
        sourceEntityKey:
          "azure_user_group_89fac263-2430-48fd-9278-dacfdfc89792",
        targetFilterKeys: [["_type", "_key"]],
        targetEntity: {
          _key: "azure_user_324e8daa-9c29-42a4-a74b-b9893e6d9750",
          _type: "azure_user",
          _class: "User",
          displayName: "User Name",
          jobTitle: "Job Title",
          email: "user@example.com",
        },
      },
      groupId: "89fac263-2430-48fd-9278-dacfdfc89792",
      memberId: "324e8daa-9c29-42a4-a74b-b9893e6d9750",
      memberType: "#microsoft.graph.user",
    };

    expect(createGroupMemberRelationship(group, member)).toEqual(relationship);
  });

  test("properties transferred for groups", () => {
    const member: GroupMember = {
      "@odata.type": "#microsoft.graph.group",
      id: "324e8daa-9c29-42a4-a74b-b9893e6d9750",
      displayName: "Managers",
      jobTitle: null,
      mail: null,
    };

    const relationship: GroupMemberRelationship = {
      _class: "HAS",
      _key:
        "azure_user_group_89fac263-2430-48fd-9278-dacfdfc89792_azure_user_group_324e8daa-9c29-42a4-a74b-b9893e6d9750",
      _type: "azure_group_has_member",
      _mapping: {
        relationshipDirection: RelationshipDirection.FORWARD,
        sourceEntityKey:
          "azure_user_group_89fac263-2430-48fd-9278-dacfdfc89792",
        targetFilterKeys: [["_type", "_key"]],
        targetEntity: {
          _key: "azure_user_group_324e8daa-9c29-42a4-a74b-b9893e6d9750",
          _type: "azure_user_group",
          _class: "UserGroup",
          displayName: "Managers",
          jobTitle: null,
          email: null,
        },
      },
      groupId: "89fac263-2430-48fd-9278-dacfdfc89792",
      memberId: "324e8daa-9c29-42a4-a74b-b9893e6d9750",
      memberType: "#microsoft.graph.group",
    };

    expect(createGroupMemberRelationship(group, member)).toEqual(relationship);
  });

  test("properties transferred for other", () => {
    const member: GroupMember = {
      "@odata.type": "#microsoft.graph.directoryObject",
      id: "324e8daa-9c29-42a4-a74b-b9893e6d9750",
      displayName: "Don't really know",
      jobTitle: null,
    };

    const relationship: GroupMemberRelationship = {
      _class: "HAS",
      _key:
        "azure_user_group_89fac263-2430-48fd-9278-dacfdfc89792_azure_group_member_324e8daa-9c29-42a4-a74b-b9893e6d9750",
      _type: "azure_group_has_member",
      _mapping: {
        relationshipDirection: RelationshipDirection.FORWARD,
        sourceEntityKey:
          "azure_user_group_89fac263-2430-48fd-9278-dacfdfc89792",
        targetFilterKeys: [["_type", "_key"]],
        targetEntity: {
          _key: "azure_group_member_324e8daa-9c29-42a4-a74b-b9893e6d9750",
          _type: "azure_group_member",
          _class: "User",
          displayName: "Don't really know",
          jobTitle: null,
          email: undefined,
        },
      },
      groupId: "89fac263-2430-48fd-9278-dacfdfc89792",
      memberId: "324e8daa-9c29-42a4-a74b-b9893e6d9750",
      memberType: "#microsoft.graph.directoryObject",
    };

    expect(createGroupMemberRelationship(group, member)).toEqual(relationship);
  });
});

describe("createVirtualMachinePublicIPAddressRelationship", () => {
  test("properties transferred", () => {
    const vm: VirtualMachine = {
      id:
        "/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/J1DEV/providers/Microsoft.Compute/virtualMachines/j1dev",
      vmId: "d908c31d-c93a-4359-987f-8cfdd1b65a61",
      location: "eastus",
    };

    const ip: PublicIPAddress = {
      id:
        "/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/j1dev/providers/Microsoft.Network/publicIPAddresses/j1dev",
    };

    const relationship: VirtualMachinePublicIPAddressRelationship = {
      _key:
        "/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/J1DEV/providers/Microsoft.Compute/virtualMachines/j1dev_uses_/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/j1dev/providers/Microsoft.Network/publicIPAddresses/j1dev",
      _type: "azure_vm_uses_public_ip",
      _class: "USES",
      _fromEntityKey:
        "/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/J1DEV/providers/Microsoft.Compute/virtualMachines/j1dev",
      _toEntityKey:
        "/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/j1dev/providers/Microsoft.Network/publicIPAddresses/j1dev",
      displayName: "USES",
      vmId: "d908c31d-c93a-4359-987f-8cfdd1b65a61",
    };

    expect(createVirtualMachinePublicIPAddressRelationship(vm, ip)).toEqual(
      relationship,
    );
  });
});

describe("createVirtualMachineNetworkInterfaceRelationship", () => {
  test("properties transferred", () => {
    const vm: VirtualMachine = {
      id:
        "/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/J1DEV/providers/Microsoft.Compute/virtualMachines/j1dev",
      vmId: "d908c31d-c93a-4359-987f-8cfdd1b65a61",
      location: "eastus",
    };

    const nic: NetworkInterface = {
      id:
        "/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/j1dev/providers/Microsoft.Network/networkInterfaces/j1dev",
    };

    const relationship: VirtualMachineNetworkInterfaceRelationship = {
      _key:
        "/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/J1DEV/providers/Microsoft.Compute/virtualMachines/j1dev_uses_/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/j1dev/providers/Microsoft.Network/networkInterfaces/j1dev",
      _type: "azure_vm_uses_network_interface",
      _class: "USES",
      _fromEntityKey:
        "/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/J1DEV/providers/Microsoft.Compute/virtualMachines/j1dev",
      _toEntityKey:
        "/subscriptions/dccea45f-7035-4a17-8731-1fd46aaa74a0/resourceGroups/j1dev/providers/Microsoft.Network/networkInterfaces/j1dev",
      displayName: "USES",
      vmId: "d908c31d-c93a-4359-987f-8cfdd1b65a61",
    };

    expect(createVirtualMachineNetworkInterfaceRelationship(vm, nic)).toEqual(
      relationship,
    );
  });
});