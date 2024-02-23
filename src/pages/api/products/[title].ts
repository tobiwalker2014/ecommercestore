import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { TApiErrorResp, TApiSingleProductResp } from "../../../types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TApiSingleProductResp | TApiErrorResp>
) {
    if (req.method === 'GET') {
        try {
            const title = req.query.title as string;
            const product = await prisma.product.findUnique({
                where: {
                title,
                },
                select: {
                title: true,
                description: true,
                price: true,
                quantity: true,
                image: true,
                },
            });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json({ product });
        } catch (error) {
            console.log('errorProduct', error);
            res.status(500).json({
                message: "Something went wrong to get Product!! Please try again after sometime",
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
