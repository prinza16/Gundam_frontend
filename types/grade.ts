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