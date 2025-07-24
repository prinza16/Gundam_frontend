type ValidationRule = (value: string) => string | null

export function validateForm<T extends Record<string, string>>(
    data: T,
    rules: Record<keyof T, ValidationRule[]>
): Partial<Record<keyof T, string>>{
    const errors: Partial<Record<keyof T, string>> = {}
    
    for (const key in rules) {
        const value = data[key]
        const fieldRules = rules[key]

        for (const rule of fieldRules) {
            const error = rule(value)
            if (error) {
                errors[key] = error
                break
            }
        }
    }

    return errors
}

export const required = (fieldName: string) => (value: string) =>
    value.trim() ? null : `กรุณากรอก${fieldName}`

export const maxLength = (limit: number, fieldName: string) => (value: string) =>
    value.length > limit ? `${fieldName}ต้องไม่เกิน ${limit} ตัวอักษร` : null
