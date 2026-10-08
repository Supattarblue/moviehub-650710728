function isLongEnough(text){
    return text.trim().length >= 10;
}
describe('isLongEnough: กติการีวิวต้องยาวอย่างน้อย 10 ตัวอักษร', () => {
  test('ข้อความยาวพอ ต้องได้ true', () => {
    expect(isLongEnough('สนุกมาก ฉากแอ็กชันดี')).toBe(true);
  });

  test('ข้อความสั้น ต้องได้ false', () => {
    expect(isLongEnough('สั้นไป')).toBe(false);
  });

  test('ช่องว่างล้วน ๆ ไม่นับเป็นความยาว', () => {
    expect(isLongEnough('          ')).toBe(false);
  });
});