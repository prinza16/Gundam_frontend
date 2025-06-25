export interface GradeDetailProps {
    params: {
        grade_id: string;
    };
}

export interface Grade {
    grade_id: number
    grade_name: string
    is_active: boolean
    create_date: string
    update_date: string
}

export interface PaginatedResponseGrade {
    count: number
    next: string | null
    previous: string | null
    results: Grade[]
}