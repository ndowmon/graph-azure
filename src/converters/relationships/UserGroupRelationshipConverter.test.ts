import { createUserGroupRelationships } from "./UserGroupRelationshipConverter";

test("convert user -> group relationships", async () => {
  const members = [
    {
      "@odata.type": "#microsoft.graph.user",
      id: "324e8daa-9c29-42a4-a74b-b9893e6d9750",
      businessPhones: [],
      displayName: "Second Test User",
      givenName: "Second",
      jobTitle: "Developer",
      mail: null,
      mobilePhone: null,
      officeLocation: null,
      preferredLanguage: null,
      surname: "Test",
      userPrincipalName: "second@admintestdualboot.onmicrosoft.com",
    },
    {
      "@odata.type": "#microsoft.graph.group",
      id: "89fac263-2430-48fd-9278-dacfdfc89792",
      deletedDateTime: null,
      classification: null,
      createdDateTime: "2019-04-23T18:06:05Z",
      creationOptions: [],
      description: null,
      displayName: "test group",
      groupTypes: [],
      mail: null,
      mailEnabled: false,
      mailNickname: "8bb2d1c34",
      onPremisesLastSyncDateTime: null,
      onPremisesSecurityIdentifier: null,
      onPremisesSyncEnabled: null,
      preferredDataLocation: null,
      proxyAddresses: [],
      renewedDateTime: "2019-04-23T18:06:05Z",
      resourceBehaviorOptions: [],
      resourceProvisioningOptions: [],
      securityEnabled: true,
      visibility: null,
      onPremisesProvisioningErrors: [],
    },
  ];

  const groupsMembers = [
    {
      group: {
        id: "89fac263-2430-48fd-9278-dacfdfc89792",
        deletedDateTime: undefined,
        classification: undefined,
        createdDateTime: "2019-04-23T18:06:05Z",
        creationOptions: [],
        description: "descr",
        displayName: "test group",
        groupTypes: [],
        mail: undefined,
        mailEnabled: false,
        mailNickname: "8bb2d1c34",
        onPremisesLastSyncDateTime: undefined,
        onPremisesSecurityIdentifier: undefined,
        onPremisesSyncEnabled: undefined,
        preferredDataLocation: undefined,
        proxyAddresses: [],
        renewedDateTime: "2019-04-23T18:06:05Z",
        resourceBehaviorOptions: [],
        resourceProvisioningOptions: [],
        securityEnabled: true,
        visibility: undefined,
        onPremisesProvisioningErrors: [],
      },
      members,
    },
  ];

  const relationshipss = createUserGroupRelationships(groupsMembers);

  expect(relationshipss).toEqual([
    {
      _class: "ASSIGNED",
      _fromEntityKey: "azure_user_group_89fac263-2430-48fd-9278-dacfdfc89792",
      _key:
        "azure_user_group_89fac263-2430-48fd-9278-dacfdfc89792_assigned_azure_user_324e8daa-9c29-42a4-a74b-b9893e6d9750",
      _toEntityKey: "azure_user_324e8daa-9c29-42a4-a74b-b9893e6d9750",
      _type: "azure_user_assigned_group",
    },
  ]);
});
