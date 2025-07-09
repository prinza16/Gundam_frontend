export interface MobilesuitDetailProps {
    params: {
        model_id: number
    }
}

export interface Mobilesuit {
    model_id: number
    model_name: string
    model_grade?: number
    model_seller?: number
    model_type?: number
    model_initial?: string // date string
    model_length?: string
    model_width?: string
    model_height?: string
    is_active: boolean
    create_date: string
    update_date: string
}

export interface MobilesuitRead extends Mobilesuit {
    model_grade_name?: string
    model_seller_name?: string
    model_type_name?: string
    main_image?: string | null
    release_date?: string | null
}

export interface PaginatedResponseMobilesuit {
    count: number
    next: string | null
    previous: string | null
    results: Mobilesuit[]
}

export interface PaginatedResponseMobilesuitRead {
    count: number
    next: string | null
    previous: string | null
    results: MobilesuitRead[]
}


