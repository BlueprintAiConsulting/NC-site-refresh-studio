import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  toastMock: vi.fn(),
  listAdminAccountsMock: vi.fn(),
  addLocalAdminAccountMock: vi.fn(),
  removeLocalAdminAccountMock: vi.fn(),
  getConfiguredAdminMock: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mocks.toastMock }),
}));

vi.mock("@/components/Header", () => ({ Header: () => <div data-testid="header" /> }));
vi.mock("@/components/Footer", () => ({ Footer: () => <div data-testid="footer" /> }));

vi.mock("@/lib/admin-auth", () => ({
  listAdminAccounts: mocks.listAdminAccountsMock,
  addLocalAdminAccount: mocks.addLocalAdminAccountMock,
  removeLocalAdminAccount: mocks.removeLocalAdminAccountMock,
  getConfiguredAdmin: mocks.getConfiguredAdminMock,
}));

describe("AdminManagement", () => {
  beforeEach(() => {
    mocks.toastMock.mockReset();
    mocks.listAdminAccountsMock.mockReset();
    mocks.addLocalAdminAccountMock.mockReset();
    mocks.removeLocalAdminAccountMock.mockReset();
    mocks.getConfiguredAdminMock.mockReset();

    mocks.getConfiguredAdminMock.mockReturnValue({
      email: "owner@example.com",
      password: "secret",
      source: "env",
      createdAt: "environment",
    });

    mocks.listAdminAccountsMock.mockReturnValue([
      { email: "owner@example.com", password: "secret", source: "env", createdAt: "environment" },
      { email: "editor@example.com", password: "pw", source: "local", createdAt: new Date().toISOString() },
    ]);

    mocks.removeLocalAdminAccountMock.mockReturnValue(true);
  });

  it("adds a local admin account with email and password", async () => {
    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newadmin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "StrongPassword123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add admin/i }));

    await waitFor(() => {
      expect(mocks.addLocalAdminAccountMock).toHaveBeenCalledWith(
        "newadmin@example.com",
        "StrongPassword123!",
      );
    });
  });

  it("requires a password when adding admin", async () => {
    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newadmin@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add admin/i }));

    await waitFor(() => {
      expect(mocks.toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password required",
        }),
      );
    });

    expect(mocks.addLocalAdminAccountMock).not.toHaveBeenCalled();
  });

  it("disables remove button for env-configured primary admin", async () => {
    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>,
    );

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    expect(removeButtons[0]).toBeDisabled();
    expect(removeButtons[1]).toBeEnabled();
  });
});
