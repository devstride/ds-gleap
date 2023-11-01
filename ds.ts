import axios from "axios";

export const API_URL = "https://api.devstride.com/v1";

export async function getUser() {
  const result = await axios.get(`${API_URL}/users/me`, {
    headers: {
      Authorization: `apiKey=${process.env.API_KEY}&apiSecret=${process.env.API_SECRET}`,
    },
  });
  return result.data.data;
}

export async function getOrganization(id: string) {
  const result = await axios.get(`${API_URL}/organizations/${id}`, {
    headers: {
      Authorization: `apiKey=${process.env.API_KEY}&apiSecret=${process.env.API_SECRET}`,
    },
  });
  return result.data.data;
}

export async function createWebhook(organizationId: string) {
  const result = await axios.post(
    `${API_URL}/organizations/${organizationId}/webhooks`,
    {
      label: "Gleap Integration",
    },
    {
      headers: {
        Authorization: `apiKey=${process.env.API_KEY}&apiSecret=${process.env.API_SECRET}`,
      },
    },
  );
  return result.data.data;
}

export async function createWorkflow(
  organizationId: string,
  webhookId: string,
  workflow: any,
) {
  const result = await axios.post(
    `${API_URL}/organizations/${organizationId}/workflows`,
    {
      ...workflow,
      description: "Create a work item when a bug is created in gleap",
      trigger: "webhook",
      referenceId: webhookId,
      nestedConditions: [],
    },
    {
      headers: {
        Authorization: `apiKey=${process.env.API_KEY}&apiSecret=${process.env.API_SECRET}`,
      },
    },
  );
  return result.data.data;
}
