import { Service, Inject } from 'typedi';
import { EnquiryRepository } from '../repository/enquiry.repository';
import { prisma } from '@/repository/prisma/prisma';
import {
    CreateEnquiryRequestDto,
    GetEnquiryByIdRequestDto,
    GetAllEnquiriesRequestDto,
    UpdateEnquiryRequestDto,
    DeleteEnquiryRequestDto,
    CreateEnquiryResponseDto,
    GetEnquiryByIdResponseDto,
    GetAllEnquiriesResponseDto,
    UpdateEnquiryResponseDto,
    DeleteEnquiryResponseDto,
    EnquiryResponseDto
} from '../dto/enquiry.dto';
import { ApiError } from '@/utils/err';
import { ApiStatusCode } from '@/utils/enum';

export interface IEnquiryService {
    createEnquiry(req: CreateEnquiryRequestDto): Promise<CreateEnquiryResponseDto>;
    getEnquiryById(req: GetEnquiryByIdRequestDto): Promise<GetEnquiryByIdResponseDto>;
    getAllEnquiries(req: GetAllEnquiriesRequestDto): Promise<GetAllEnquiriesResponseDto>;
    updateEnquiryById(req: UpdateEnquiryRequestDto): Promise<UpdateEnquiryResponseDto>;
    deleteEnquiryById(req: DeleteEnquiryRequestDto): Promise<DeleteEnquiryResponseDto>;
}

@Service()
export class EnquiryService implements IEnquiryService {
    @Inject(() => EnquiryRepository)
    private enquiryRepository!: EnquiryRepository;

    async createEnquiry(req: CreateEnquiryRequestDto): Promise<CreateEnquiryResponseDto> {
        const validated = req.validate();
        const created = await prisma.$transaction(async (tx) => {
            const c = await this.enquiryRepository.createEnquiry(tx, {
                email: validated.email || null,
                name: validated.name || null,
                phone: validated.phone || null,
                message: validated.message
            } as any);
            return c;
        });

        return new CreateEnquiryResponseDto({
            id: created.id,
            email: created.email || undefined,
            name: created.name || undefined,
            phone: created.phone || undefined,
            message: created.message,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt
        });
    }

    async getEnquiryById(req: GetEnquiryByIdRequestDto): Promise<GetEnquiryByIdResponseDto> {
        const validated = req.validate();
        const enquiry = await this.enquiryRepository.getEnquiryById(undefined, validated.id);
        if (!enquiry) {
            throw new ApiError('Enquiry not found', ApiStatusCode.UNKNOWN_ERROR, 404);
        }
        return new GetEnquiryByIdResponseDto({
            id: enquiry.id,
            email: enquiry.email || undefined,
            name: enquiry.name || undefined,
            phone: enquiry.phone || undefined,
            message: enquiry.message,
            createdAt: enquiry.createdAt,
            updatedAt: enquiry.updatedAt
        });
    }

    async getAllEnquiries(req: GetAllEnquiriesRequestDto): Promise<GetAllEnquiriesResponseDto> {
        const validated = req.validate();
        const { enquiries, total } = await this.enquiryRepository.getAllEnquiries(
            undefined,
            validated.limit,
            validated.offset,
            validated.orderBy as any
        );
        return new GetAllEnquiriesResponseDto({
            enquiries: enquiries.map(e => ({
                id: e.id,
                email: e.email || undefined,
                name: e.name || undefined,
                phone: e.phone || undefined,
                message: e.message,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt
            })),
            total
        });
    }

    async updateEnquiryById(req: UpdateEnquiryRequestDto): Promise<UpdateEnquiryResponseDto> {
        const validated = req.validate();
        const updated = await prisma.$transaction(async (tx) => {
            const u = await this.enquiryRepository.updateEnquiryById(tx, validated.id, {
                email: validated.email,
                name: validated.name,
                phone: validated.phone,
                message: validated.message
            });
            return u;
        });
        return new UpdateEnquiryResponseDto({
            id: updated.id,
            email: updated.email || undefined,
            name: updated.name || undefined,
            phone: updated.phone || undefined,
            message: updated.message,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt
        });
    }

    async deleteEnquiryById(req: DeleteEnquiryRequestDto): Promise<DeleteEnquiryResponseDto> {
        const validated = req.validate();
        await prisma.$transaction(async (tx) => {
            await this.enquiryRepository.deleteEnquiryById(tx, validated.id);
        });
        return new DeleteEnquiryResponseDto({ success: true, message: 'Enquiry deleted successfully' });
    }
}
