import { hasCyrillicName } from './member';

test('should identify if name has cyrillic characters', () => {
  expect(
    hasCyrillicName({
      first_name: 'test',
      last_name: 'Фреймер',
      id: 1,
      is_bot: false,
      username: 'test',
    })
  ).toBeTruthy();
  expect(
    hasCyrillicName({
      first_name: 'Фреймер',
      last_name: 'test',
      id: 1,
      is_bot: false,
      username: 'test',
    })
  ).toBeTruthy();
  expect(
    hasCyrillicName({
      first_name: 'test',
      last_name: 'magalhães',
      id: 1,
      is_bot: false,
      username: 'test',
    })
  ).toBeFalsy();
});
