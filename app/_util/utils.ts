function parseErrors(errorObj: Record<string, string[]>) {
    let result = '';

    if (errorObj.errors) {
        for (const [field, messages] of Object.entries(errorObj.errors)) {
            const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
            const messageText = messages.join(', ');
            result += `${formattedField}: ${messageText}\n`;
        }
    } else {
        result = 'No errors found.';
    }

    return result.trim();
}

export {parseErrors}