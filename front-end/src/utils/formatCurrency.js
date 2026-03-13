export const formatCurrency = (number) => {
  // 1. Dùng Math.round() để làm tròn về số nguyên gần nhất
  const integerNumber = Math.round(Number(number)); 
  // 2. Định dạng số nguyên đã làm tròn (sẽ không còn dấu phẩy thập phân)
  return integerNumber.toLocaleString('vi-VN');
}