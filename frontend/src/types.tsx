export type Company = {
    id:number
    name: string
    plan: 'basic' | 'pro' | 'enterprise'
    createdAt: string
    

};

export type CreateCompanyPayload = {
    companyName: string 
    plan: 'basic' | 'pro' | 'enterprise'
    ownerName: string
    ownerEmail: string
    ownerPassword: string

}

export type User = {
    id: number
    name: string
    email: string
    role: 'owner' | 'employee'
    compnayId: number
    createdAt:  string

}

export type CreateEmployeePayload = {
    name: string
    email: string
    password: string
    
}
export type Screenshot = {
    id: number
    companyId: number
    userId: number
    name: string
    path: string 
    type: string
    createdAt: string
}

export type CreateScreenshotPayload = {
    companyId: number
    userId: number
    name: string
    path: string
    type: string
}
    