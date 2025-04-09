import { UserRole } from "@prisma/client";

export type UserDto = {
    id: string;
    name: string;
    email: string;
    role: UserRole
}