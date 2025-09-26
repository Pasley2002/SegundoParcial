import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPagina } from './chat-pagina';

describe('ChatPagina', () => {
  let component: ChatPagina;
  let fixture: ComponentFixture<ChatPagina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPagina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatPagina);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
