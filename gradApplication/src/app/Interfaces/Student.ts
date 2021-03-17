export interface IStudent {
    name: string;
    surname: string;
    studentNumber: string;
    totalMark: string;
    uniqueId?: string;
    groupName: string,
    id?: any
}
export interface UStudent{
    name : string,
    surname : string,
    studentNumber :string,
    totalMark :string,
    groupname: string
}

export interface IGroup{
    
    groupName: string,
    groupId: string,
    assignemts: any[],
    id? : any
  }