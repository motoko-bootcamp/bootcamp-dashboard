import { ActorSubclass, AnonymousIdentity } from '@dfinity/agent';
import { Activity } from '../types/types'

import { _SERVICE as VerifierService } from '../../src/declarations/Verifier/Verifier.did';
import {
  canisterId as verifierCanisterId,
  createActor as createVerifierActor,
  idlFactory as verifierFactory,
} from '../../src/declarations/Verifier';


import { Student, Team, TeamString } from '../types/types';
import { useAuthStore } from '../store/authstore';


const isLocal: boolean =
  window.location.origin.includes('localhost') ||
  window.location.origin.includes('127.0.0.1');

export async function getVerifierActor(): Promise<ActorSubclass<VerifierService>> {
  console.log( "local ? ", isLocal)
  await useAuthStore?.getState().getIdentity();
  console.log ("useAuthStore?.getState().identity", useAuthStore?.getState().identity);
  var identity =
    (await useAuthStore?.getState().identity) || new AnonymousIdentity();
  return createVerifierActor(verifierCanisterId as string, {
    agentOptions: {
      identity,
      host: 'https://icp-api.io ',
    },
  });
}

//TODO refactor out and use in activitystore
export async function getActivityFeed(): Promise<Activity[] | undefined> {
  const verifier = await getVerifierActor();
  const result = await verifier.getActivityFeed();
  if ('err' in result) {
    console.error(result.err);
    return undefined;
  } else {
    return result;
  }
}
//TODO refactor out and use in userstore
export async function getStudent(PrincipalId: string): Promise<Student | undefined> {
  const verifier = await getVerifierActor();
  const result = await verifier.getStudent(
    PrincipalId
  );
  console.log("Result from getStudent:", result); 
  if ('err' in result) {
    console.error(result.err);
    return undefined;
  } else {
    return result.ok;
  }
}

//TODO refactor out and use in teamstore
export async function getTeam(teamId: string): Promise<Team | undefined> {
  const verifier = await getVerifierActor();
  const result = await verifier.getTeam(
    teamId
  );
  if ('err' in result) {
    console.error(result.err);
    return undefined;
  } else {
    return result;
  }
}

//TODO refactor out and use in teamstore
export async function getAllTeams(): Promise<TeamString[] | undefined> {
  const verifier = await getVerifierActor();
  const result = await verifier.getAllTeams();
  if ('err' in result) {
    console.error(result.err);
    return undefined;
  } else {
    return result;
  }
}

