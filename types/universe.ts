export interface UniverseDetailProps {
    params: {
        universe_id: string
    }
}

export interface Universe {
    universe_id: number
    universe_name: string
    is_active: boolean
    create_date: string
    update_date: string
}

export interface PaginatedResponseUniverse {
    count: number
    next: string | null
    previous: string | null
    results: Universe[]
}
