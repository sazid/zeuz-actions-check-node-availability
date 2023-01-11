const core = require('@actions/core');
const fetch = require('node-fetch');
const wait = require('./wait');


/*
// most @actions toolkit packages have async methods
async function run() {
  try {
    const ms = core.getInput('milliseconds');
    core.info(`Waiting ${ms} milliseconds ...`);

    core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    await wait(parseInt(ms));
    core.info((new Date()).toTimeString());

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}
*/

async function getMachines(server, apiKey, teamID, projectID) {
  // remove trailing slash if present
  if (server.slice(-1) == '/') {
    server = server.slice(0, -1);
  }
  const url = `${server}/api/machines/list?` + new URLSearchParams({
    team: teamID,
    projectID: projectID,
  });

  return fetch(url, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
  });
}

function checkMachineRegex(target, list) {
  for (let i = 0; i < list.length; i++) {
      if (target.test(list[i])) {
          return list[i];
      }
  }
  return null;
}

async function run() {
  try {
    // https://qa.isara.com/api/machines/list?project=%7B%7Bproject%7D%7D&team=%7B%7Bteam%7D%7D&user_level=Automation
    // required inputs
    const server = core.getInput('zeuz_server_host');
    const apiKey = core.getInput('zeuz_api_key');
    const teamID = parseInt(core.getInput('zeuz_team_id'));
    const projectID = core.getInput('zeuz_project_id');
    const nodeID = core.getInput('node_id');
    const nodeIDRegex = new RegExp(nodeID);

    // optional inputs
    // retry interval cannot be less than 1
    const retryInterval = Math.max(1, parseInt(core.getInput('retry_interval')));
    // retry timeout >= retry interval
    const retryTimeout = Math.max(retryInterval, parseInt(core.getInput('retry_timeout')));

    core.info(`Server: ${server}`);
    core.info(`Team ID: ${teamID}`);
    core.info(`Project: ${projectID}`);
    core.info(`Node ID Regex pattern: ${nodeID}`);
    core.info(`Retry timeout: ${retryTimeout}`);
    core.info(`Retry interval: ${retryInterval}`);

    let response = null;
    for (let i = 0; i < retryTimeout; i += retryInterval) {
      try {
        response = await getMachines(server, apiKey, teamID, projectID);
        const machines = response.json();
        core.info(machines);

        let pickedNodeID = checkMachineRegex(nodeIDRegex, machines);
        if (pickedNodeID != null) {
          core.info("Picked machine: " + pickedNodeID);
          core.setOutput("node_id", pickedNodeID);
          return;
        } else {
          core.info(`Iteration #${i}: Could not find machine. Retrying...`);
          await wait(retryInterval * 1000);
        }
      } catch (error) {
        core.error(`error fetching machines list, error: ${error}`);
        core.error(error.stack);
      }
    }

    core.setFailed(`Failed to find any available nodes with the given node id pattern: ${nodeID}`);
  } catch (error) {
    core.error(error.stack)
    core.setFailed(error.message);
  }
}

run();
