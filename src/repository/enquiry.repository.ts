import { Prisma, Enquiry as PrismaEnquiry } from '@prisma/client';
import { prisma } from './prisma/prisma';
import { Service } from 'typedi';

export interface IEnquiryRepository {
    createEnquiry(tx: Prisma.TransactionClient | undefined, enquiry: Omit<PrismaEnquiry, 'id' | 'createdAt' | 'updatedAt'>): Promise<PrismaEnquiry>;
    getEnquiryById(tx: Prisma.TransactionClient | undefined, id: number): Promise<PrismaEnquiry | null>;
    getAllEnquiries(tx: Prisma.TransactionClient | undefined, limit?: number, offset?: number, orderBy?: { field: keyof PrismaEnquiry, direction: 'asc' | 'desc' }): Promise<{ enquiries: PrismaEnquiry[], total: number }>;
    updateEnquiryById(tx: Prisma.TransactionClient | undefined, id: number, enquiry: Partial<Omit<PrismaEnquiry, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PrismaEnquiry>;
    deleteEnquiryById(tx: Prisma.TransactionClient | undefined, id: number): Promise<void>;
}

@Service()
export class EnquiryRepository implements IEnquiryRepository {
    async createEnquiry(tx: Prisma.TransactionClient | undefined, enquiry: Omit<PrismaEnquiry, 'id' | 'createdAt' | 'updatedAt'>): Promise<PrismaEnquiry> {
        const client = (tx ?? prisma);
        return client.enquiry.create({
            data: {
                email: enquiry.email,
                name: enquiry.name,
                phone: enquiry.phone,
                message: enquiry.message,
            }
        });
    }

    async getEnquiryById(tx: Prisma.TransactionClient | undefined, id: number): Promise<PrismaEnquiry | null> {
        const client = (tx ?? prisma);
        return client.enquiry.findUnique({ where: { id, isDeleted: false } });
    }

    async getAllEnquiries(
        tx: Prisma.TransactionClient | undefined,
        limit?: number,
        offset?: number,
        orderBy?: { field: keyof PrismaEnquiry, direction: 'asc' | 'desc' }
    ): Promise<{ enquiries: PrismaEnquiry[], total: number }> {
        const client = (tx ?? prisma);
        const enquiries = await client.enquiry.findMany({
            where: { isDeleted: false },
            take: limit,
            skip: offset,
            orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : { createdAt: 'desc' },
        });
        const total = await client.enquiry.count({ where: { deletedAt: null } });
        return { enquiries, total };
    }

    async updateEnquiryById(tx: Prisma.TransactionClient | undefined, id: number, enquiry: Partial<Omit<PrismaEnquiry, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PrismaEnquiry> {
        const client = (tx ?? prisma);
        return client.enquiry.update({
            where: { id, isDeleted: false },
            data: {
                email: enquiry.email,
                name: enquiry.name,
                phone: enquiry.phone,
                message: enquiry.message,
            }
        });
    }

    async deleteEnquiryById(tx: Prisma.TransactionClient | undefined, id: number): Promise<void> {
        const client = (tx ?? prisma);
        await client.enquiry.update({
            where: {
                id,
                isDeleted: false
            },
            data: {
                deletedAt: new Date(),
                isDeleted: true
            }
        });
    }
}
