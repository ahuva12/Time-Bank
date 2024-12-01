export function calculateAge(birthDate: Date): number {
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

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
