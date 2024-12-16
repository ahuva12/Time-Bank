import bcrypt from 'bcryptjs';

export function calculateAge(birthDate: Date | string): number {
    const parsedDate = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const today = new Date();
    const birthYear = parsedDate.getFullYear();
    const birthMonth = parsedDate.getMonth();
    const birthDay = parsedDate.getDate();

    let age = today.getFullYear() - birthYear;

    // Adjust the age if the birthday has not occurred yet this year
    if (
        today.getMonth() < birthMonth || 
        (today.getMonth() === birthMonth && today.getDate() < birthDay)
    ) {
        age--;
    }

    return age;
}

export const verifyPassword = async (password1:string, password2:string) => {
    return await bcrypt.compare(password1, password2);
}
