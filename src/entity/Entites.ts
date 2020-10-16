import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm";

const tablePrefix = "Discord_";


@Entity(`${tablePrefix}Requester`)
export class Requester extends BaseEntity {
    @PrimaryColumn()
    userId: string;
    @Column()
    msgId!: string;
}
