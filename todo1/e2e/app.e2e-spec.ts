import { Todo1Page } from './app.po';

describe('todo1 App', () => {
  let page: Todo1Page;

  beforeEach(() => {
    page = new Todo1Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
