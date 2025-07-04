export interface SellerDetailProps {
    params: {
        seller_id: string
    }
}

export interface Seller {
    seller_id: number
    seller_name: string
    is_active: boolean
    create_date: string
    update_date: string
}

export interface PaginatedResponseSeller {
    count: number
    next: string | null
    previous: string | null
    results: Seller[]
}