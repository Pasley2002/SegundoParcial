import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminAuthGuard } from '../service/admin-auth-guard';

describe('AdminAuthGuard', () => {
  let guard: AdminAuthGuard;
  let router: Router;
  let fakeActivatedRoute: ActivatedRouteSnapshot;
  let fakeRouterState: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminAuthGuard,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    });

    guard = TestBed.inject(AdminAuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});