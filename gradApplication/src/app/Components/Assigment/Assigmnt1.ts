
export interface Assigment {
    mainTitle: MainProperties[],
    total: number
    name: string,
    weight: number
}
export interface MainProperties {
    description: string,
    content: mainTitleContent
}
export interface mainTitleContent {
    totalMark: number,
    learnerMark: number,
    commment?: string
}

export interface dropDownTemplate {
    name: string,
    index: number
}

export interface submitAssigmentDTO {
    data: Assigment,
    groupName: string
}

export interface UAssigment{
  assigmentId: string,
  groupName: string,
  data:any
}