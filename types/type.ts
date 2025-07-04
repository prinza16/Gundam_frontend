export interface TypeDetailProps {
    params: {
        types_id: string
    }
}

export interface Type {
    types_id: number
    types_name: string
    is_active: boolean
    create_date: string
    update_date: string
}

export interface PaginatedResponseType {
    count: number 
    next: string | null
    previous: string | null
    results: Type[]
}