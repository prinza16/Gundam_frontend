export interface SeriesDetailProps {
    params: {
        series_id: string
    }
}

export interface Series {
    series_id: number
    series_name: string
    series_universe: number
    series_universe_name: string 
    series_image: string
    is_active: boolean
    create_date: string
    update_date: string
}

export interface SeriesRead extends Series {
    series_universe_name: string
}

export interface PaginatedResponseSeries {
    count: number
    next: string | null
    previous: string | null
    results: Series[]
}

export interface PaginatedResponseSeriesRead {
    count: number 
    next: string | null
    previous: string | null
    results: SeriesRead[]
}



