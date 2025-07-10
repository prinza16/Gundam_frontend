export interface PilotDetailProps {
    params: {
        pilot_id: number
    }
}

export interface Pilot {
    pilot_id: number
    pilot_name: string
    pilot_images: string | null
    pilot_universe: number
    is_active: boolean
    create_date: string
    update_date: string
}

export interface PilotRead extends Pilot {
    pilot_universe_name: string
}

export interface PaginatedResponsePilot {
    count: number
    next: string | null
    previous: string | null
    results: Pilot[]
}

export interface PaginatedResponsePilotRead {
    count: number 
    next: string | null
    previous: string | null
    results: PilotRead[]
}