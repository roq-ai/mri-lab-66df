import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { providerValidationSchema } from 'validationSchema/providers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.provider
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getProviderById();
    case 'PUT':
      return updateProviderById();
    case 'DELETE':
      return deleteProviderById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProviderById() {
    const data = await prisma.provider.findFirst(convertQueryToPrismaUtil(req.query, 'provider'));
    return res.status(200).json(data);
  }

  async function updateProviderById() {
    await providerValidationSchema.validate(req.body);
    const data = await prisma.provider.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    if (req.body.name) {
      await roqClient.asUser(roqUserId).updateTenant({ id: user.tenantId, tenant: { name: req.body.name } });
    }
    return res.status(200).json(data);
  }
  async function deleteProviderById() {
    const data = await prisma.provider.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
