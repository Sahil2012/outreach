import { getAuth } from '@clerk/express';
import { Request, Response } from 'express';
import { StatsDTO } from '../dto/reponse/StatsDTO.js';
import { getStats } from '../service/threadService.js';
import prisma from '../apis/prismaClient.js';
import { log } from 'node:console';

export const extractStats = async (req: Request, res: Response<StatsDTO | {error: string}>) => {

    const {userId: clerkUserId} = getAuth(req);
    log("Extracting stats for user:", clerkUserId);
    try {
        const stats = await getStats(prisma, clerkUserId!);
        log("Stats extracted successfully for user:", clerkUserId, stats);
        return res.status(200).json(stats);
    }catch (error) {
        console.error("Error extracting stats:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

}