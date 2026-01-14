/**
 * Validation Utilities
 * Helper functions for complex validation logic
 */

/**
 * Check if password is strong enough
 * Returns detailed feedback and score
 */
export function isStrongPassword(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
} {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('At least one lowercase letter');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('At least one uppercase letter');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('At least one number');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('At least one special character');

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
        score -= 1;
        feedback.push('Avoid repeated characters');
    }

    return {
        isStrong: score >= 5,
        score: Math.max(0, Math.min(score, 6)),
        feedback,
    };
}

/**
 * Check if email is valid and not from disposable service
 */
export function validateEmail(email: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
        return { isValid: false, errors };
    }

    // Check disposable email domains
    // In a real app, this list should be more comprehensive or fetched from an API
    const disposableDomains = [
        'tempmail.com',
        '10minutemail.com',
        'guerrillamail.com',
        'mailinator.com',
        'yopmail.com',
        'throwawaymail.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && disposableDomains.includes(domain)) {
        errors.push('Disposable email addresses are not allowed');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
