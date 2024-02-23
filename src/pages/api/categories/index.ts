import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { TApiAllCategoriesResp, TApiErrorResp } from "../../../types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TApiAllCategoriesResp | TApiErrorResp>
) {
    if (req.method === 'GET') {
        try {
        const categories = await prisma.category.findMany({
            select: {
            id: true,
            name: true,
            products: {
                orderBy: {
                createdAt: "desc",
                },
                take: 8,
                select: {
                title: true,
                description: true,
                image: true,
                price: true,
                },
            },
            },
            orderBy: {
            createdAt: "desc",
            },
        });
        res.status(200).json({ categories });
        } catch (error) {
        console.log('error', error);
        res.status(500).json({
            message: "Something went wrong!! Please try again after sometime",
        });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
