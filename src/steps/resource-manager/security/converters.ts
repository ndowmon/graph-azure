import {
  Entity,
  createIntegrationEntity,
  convertProperties,
} from '@jupiterone/integration-sdk-core';

import { AzureWebLinker } from '../../../azure';
import { SecurityEntities } from './constants';
import {
  SecurityAssessment,
  AzureResourceDetails,
} from '@azure/arm-security/esm/models';

function findSecurityAssessmentScannedResourceId(
  data: SecurityAssessment,
): string | undefined {
  // typescript typings are wrong, these properties use capital letters
  // testing both in case this is remediated in the API in the future.
  const source =
    data.resourceDetails.source || (data.resourceDetails as any).Source;
  if (source === 'Azure') {
    return (
      (data.resourceDetails as AzureResourceDetails).id ||
      (data.resourceDetails as any).Id
    );
  }
}

export function createAssessmentEntity(
  webLinker: AzureWebLinker,
  data: SecurityAssessment,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        ...convertProperties(data),
        ...prefixProperties(convertProperties(data.metadata), 'metadata'),
        ...prefixProperties(
          convertProperties(data.resourceDetails),
          'resourceDetails',
        ),
        _key: data.id as string,
        _type: SecurityEntities.ASSESSMENT._type,
        _class: SecurityEntities.ASSESSMENT._class,
        id: data.id,
        name: data.name,
        displayName: data.displayName,
        category: data.metadata?.category
          ? JSON.stringify(data.metadata.category)
          : 'Security Assessment',
        summary: data.displayName,
        internal: true,
        type: data.type,
        statusCode: data.status.code,
        statusCause: data.status.cause,
        statusDescription: data.status.description,

        scannedResourceId: findSecurityAssessmentScannedResourceId(data),

        webLink: webLinker.portalResourceUrl(data.id),
      },
    },
  });
}

function prefixProperties(
  obj: { [k: string]: any },
  prefix: string,
): { [k: string]: any } {
  const newObj: { [k: string]: any } = {};

  for (const key of Object.keys(obj)) {
    newObj[prefix + capitalizeFirstLetter(key)] = obj[key];
  }
  return newObj;
}

function capitalizeFirstLetter(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
