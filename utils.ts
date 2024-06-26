export const replaceNumberFormat = (inputString: string): string => {
  // Преобразуем строку в число
  const number = parseFloat(inputString);

  // Проверяем, является ли входная строка корректным числом
  if (isNaN(number)) {
    return inputString; // Если не число, возвращаем оригинальную строку
  }

  // Преобразуем число в строку с двумя знаками после запятой
  const formattedNumber = number.toFixed(2);

  // Разбиваем на целую и дробную часть
  const parts = formattedNumber.split(".");

  // Форматируем целую часть с разделителями тысяч
  const formattedInteger = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Возвращаем целую и дробную части, соединенные запятой
  return `${formattedInteger},${parts[1]}`;
};
