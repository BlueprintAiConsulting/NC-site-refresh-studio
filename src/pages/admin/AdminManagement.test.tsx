import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  toastMock: vi.fn(),
  invokeMock: vi.fn(),
  rpcMock: vi.fn(),
  useAuthMock: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mocks.toastMock }),
}));

vi.mock("@/components/Header", () => ({ Header: () => <div data-testid="header" /> }));
vi.mock("@/components/Footer", () => ({ Footer: () => <div data-testid="footer" /> }));

vi.mock("@/contexts/useAuth", () => ({
  useAuth: () => mocks.useAuthMock(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: mocks.invokeMock,
    },
    rpc: mocks.rpcMock,
  },
}));

describe("AdminManagement", () => {
  beforeEach(() => {
    mocks.toastMock.mockReset();
    mocks.invokeMock.mockReset();
    mocks.rpcMock.mockReset();
    mocks.useAuthMock.mockReset();

    mocks.useAuthMock.mockReturnValue({
      user: { email: "editor@example.com", id: "admin:editor@example.com" },
      session: null,
      isAdmin: true,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    mocks.invokeMock.mockImplementation(async (fnName: string) => {
      if (fnName === "list-admins") {
        return {
          data: {
            admins: [
              { email: "editor@example.com", created_at: new Date().toISOString() },
              { email: "other-admin@example.com", created_at: new Date().toISOString() },
            ],
          },
          error: null,
        };
      }

      return { data: { message: "ok" }, error: null };
    });

    mocks.rpcMock.mockResolvedValue({ data: [], error: null });
  });

  it("adds an admin via backend function", async () => {
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

    fireEvent.click(screen.getByRole("button", { name: /save admin/i }));

    await waitFor(() => {
      expect(mocks.invokeMock).toHaveBeenCalledWith("add-admin", {
        body: {
          email: "newadmin@example.com",
          password: "StrongPassword123!",
          sendInvite: false,
        },
      });
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
    fireEvent.click(screen.getByRole("button", { name: /save admin/i }));

    await waitFor(() => {
      expect(mocks.toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password required",
        }),
      );
    });

    expect(mocks.invokeMock).not.toHaveBeenCalledWith("add-admin", expect.anything());
  });

  it("allows non-super admins to reset only their own password", async () => {
    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>,
    );

    const resetPasswordInputs = await screen.findAllByLabelText(/reset password/i);
    fireEvent.change(resetPasswordInputs[0], {
      target: { value: "UpdatedPass456!" },
    });

    const resetButtons = screen.getAllByRole("button", { name: /reset password/i });
    fireEvent.click(resetButtons[0]);

    await waitFor(() => {
      expect(mocks.invokeMock).toHaveBeenCalledWith("add-admin", {
        body: {
          email: "editor@example.com",
          password: "UpdatedPass456!",
          sendInvite: false,
        },
      });
    });

    expect(resetPasswordInputs[1]).toBeDisabled();
    expect(resetButtons[1]).toBeDisabled();
  });

  it("allows super admin to reset other admin passwords", async () => {
    mocks.useAuthMock.mockReturnValue({
      user: { email: "drewhufnagle@gmail.com", id: "admin:drewhufnagle@gmail.com" },
      session: null,
      isAdmin: true,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>,
    );

    const resetPasswordInputs = await screen.findAllByLabelText(/reset password/i);
    fireEvent.change(resetPasswordInputs[1], {
      target: { value: "AnotherPass789!" },
    });

    const resetButtons = screen.getAllByRole("button", { name: /reset password/i });
    fireEvent.click(resetButtons[1]);

    await waitFor(() => {
      expect(mocks.invokeMock).toHaveBeenCalledWith("add-admin", {
        body: {
          email: "other-admin@example.com",
          password: "AnotherPass789!",
          sendInvite: false,
        },
      });
    });
  });
});
