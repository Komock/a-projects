import { ProjectsLabPage } from './app.po';

describe('projects-lab App', () => {
  let page: ProjectsLabPage;

  beforeEach(() => {
    page = new ProjectsLabPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
