import { program } from "commander";
import dotenv from "dotenv";
import {
  API_URL,
  createWebhook,
  createWorkflow,
  getOrganization,
  getUser,
} from "./ds";
import { prompt } from "promptly";
import * as process from "process";

dotenv.config();
program
  .name("ds-gleap")
  .description("CLI to add a new gleap integration to devstride")
  .version("0.0.1");

program
  .command("create")
  .description("Create the new integration")
  .action(async () => {
    const user = await getUser();
    console.log(`Authenticated as "${user.name}"`);

    const organizationId = user.organizationMemberships[0].organizationId;

    const organization = await getOrganization(organizationId);
    console.log(`Organization: ${organization.label}`);
    let webhookId = process.env.WEBHOOK_ID || "";

    if (!webhookId) {
      console.log("Creating webhook endpoint...");
      const webhook = await createWebhook(organizationId);
      webhookId = webhook.id;
      console.log(
        `Created webhook with id, use this url to configure gleap: ${API_URL}/organizations/${organizationId}/webhooks/${webhook.id}`,
      );
    }

    let parentNumber = process.env.PARENT_NUMBER || "";
    if (!parentNumber) {
      parentNumber = await prompt("Parent number (e.g. F2): ");
    }

    await createWorkflow(organizationId, webhookId, {
      triggerConditions: [
        {
          value: "CREATE",
          path: "$.integrationAction",
          operator: "equal",
        },
      ],
      actions: [
        {
          type: "create-workitem",
          data: {
            description: {
              type: "data",
              data: {
                html: {
                  type: "template",
                  template:
                    '<p><a target="_blank" rel="noopener noreferrer nofollow" href="https://app.gleap.io/projects/${project}/bugs/${shareToken}">${issueType}#${bugId}</a></p><p><strong>Reported By:</strong> <a target="_blank" rel="noopener noreferrer nofollow" href="mailto:${reportedBy}">${reportedBy}</a></p><h4><br><strong>Description</strong></h4><p>${text}</p>',
                  variables: {
                    issueType: {
                      type: "reference",
                      reference: "$.input.data.type",
                    },
                    bugId: {
                      type: "reference",
                      reference: "$.input.data.bugId",
                    },
                    project: {
                      type: "reference",
                      reference: "$.input.data.project",
                    },
                    text: {
                      type: "reference",
                      reference: "$.input.data.formText",
                    },
                    shareToken: {
                      type: "reference",
                      reference: "$.input.data.shareToken",
                    },
                    reportedBy: {
                      type: "reference",
                      reference: "$.input.data.session.email",
                    },
                  },
                },
              },
            },
            title: {
              type: "template",
              template: "[${issueType}] #${bugId}",
              variables: {
                issueType: {
                  type: "reference",
                  reference: "$.input.data.type",
                },
                bugId: {
                  type: "reference",
                  reference: "$.input.data.bugId",
                },
              },
            },
            color: {
              type: "value",
              value: "blue",
            },
            parentNumber: {
              type: "value",
              value: parentNumber,
            },
          },
        },
      ],
    });
  });

program.parse();
