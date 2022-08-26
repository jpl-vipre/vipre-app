export const digitToSuperScript = (digit: string) => {
    let superscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    let numberStrArr: any[] = Array.from(`${Number(digit.replace(/[^0-9.eE]+/, ""))}`);
    return numberStrArr.map((num) => !isNaN(num) ? superscripts[Number(num)] : num).join("");
}
