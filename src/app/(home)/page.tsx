"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  EditRounded,
  DeleteRounded,
  AddRounded,
  FilterListRounded,
  CloseRounded,
  VisibilityRounded,
  VisibilityOffRounded,
} from "@mui/icons-material";
import { Edit } from "lucide-react";
import AddButton from "@/Components/GlobalStyles/Button/Add/Add";

// Types

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  company: string;
  department: string;
  division: string;
  address: string;
  mobile: string;
  landline: string;
  isDisabled: boolean;
  isVerified: boolean;
  created: string;
  modified: string;
};

type EmployeeForm = Omit<Employee, "id" | "created" | "modified"> & {
  password: string;
  confirmPassword: string;
};

type TextFieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "address"
  | "mobile"
  | "landline";

type SelectFieldName = "role" | "company" | "department" | "division";

// Constants

const employeesData = [
  [
    "Aashish",
    "Thapa",
    "aashish@company.com",
    "Employee",
    "ABC Company",
    "Engineering",
    "Core Platform",
    "Kathmandu",
    "+977 9801234567",
    "01-4567890",
    false,
    true,
    "2026-10-20",
    "2026-10-28",
  ],
  [
    "Sita",
    "Sharma",
    "sita@company.com",
    "Manager",
    "ABC Company",
    "Human Resources",
    "People Operations",
    "Pokhara",
    "+977 9812345678",
    "",
    true,
    false,
    "2026-10-21",
    "2026-10-27",
  ],
  [
    "Ram",
    "Adhikari",
    "ram@company.com",
    "Employee",
    "ABC Company",
    "Finance",
    "Accounting",
    "Lalitpur",
    "+977 9823456789",
    "056-520123",
    false,
    true,
    "2026-10-22",
    "2026-10-29",
  ],
  [
    "Anisha",
    "Karki",
    "anisha@company.com",
    "Admin",
    "XYZ Company",
    "Marketing",
    "Digital Marketing",
    "Bhaktapur",
    "+977 9845678901",
    "",
    false,
    false,
    "2026-10-23",
    "2026-10-29",
  ],
] as const;

const initialEmployees: Employee[] = [];

for (const [i, e] of employeesData.entries()) {
  const [
    firstName,
    lastName,
    email,
    role,
    company,
    department,
    division,
    city,
    mobile,
    landline,
    isDisabled,
    isVerified,
    created,
    modified,
  ] = e;

  initialEmployees.push({
    id: i + 1,
    firstName,
    lastName,
    email,
    role,
    company,
    department,
    division,
    address: `${city}, Nepal`,
    mobile,
    landline,
    isDisabled,
    isVerified,
    created,
    modified,
  });
}

const emptyForm: EmployeeForm = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  company: "",
  department: "",
  division: "",
  address: "",
  mobile: "",
  landline: "",
  password: "",
  confirmPassword: "",
  isDisabled: false,
  isVerified: false,
};

const options = {
  role: ["Admin", "Manager", "Employee", "HR"],
  company: ["ABC Company", "XYZ Company", "Demo Company"],
  department: [
    "Engineering",
    "Human Resources",
    "Finance",
    "Marketing",
    "IT Support",
    "Sales",
  ],
  division: [
    "Core Platform",
    "People Operations",
    "Accounting",
    "Digital Marketing",
    "Infrastructure",
    "Business Development",
  ],
};

const tableHeadings = [
  "SN",
  "First Name",
  "Last Name",
  "Department",
  "Division",
  "Address",
  "Mobile Number",
  "Landline Number",
  "Email",
  "Role",
  "Company",
  "Is Disabled",
  "Is Verified",
  "Created",
  "Modified",
  "Action",
];

// Page

export default function HomePage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<EmployeeForm>({
    defaultValues: emptyForm,
    mode: "onSubmit",
  });

  const today = () => new Date().toISOString().slice(0, 10);

  const filteredEmployees = employees.filter((employee) => {
    const query = search.trim().toLowerCase();

    const matchesSearch = [
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.department,
      employee.company,
    ].some((value) => value.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !employee.isDisabled) ||
      (statusFilter === "disabled" && employee.isDisabled);

    return matchesSearch && matchesStatus;
  });

  // Form helpers

  const resetEmployeeForm = () => {
    reset({ ...emptyForm });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const openAddForm = () => {
    setEditingEmployee(null);
    resetEmployeeForm();
    setFormOpen(true);
  };

  const openEditForm = (employee: Employee) => {
    setEditingEmployee(employee);

    reset({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      role: employee.role,
      company: employee.company,
      department: employee.department,
      division: employee.division,
      address: employee.address,
      mobile: employee.mobile,
      landline: employee.landline ?? "",
      password: "",
      confirmPassword: "",
      isDisabled: employee.isDisabled,
      isVerified: employee.isVerified,
    });

    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingEmployee(null);
    resetEmployeeForm();
  };

  // Reusable text field

  const renderTextField = (
    field: TextFieldName,
    label: string,
    required = false,
    type = "text",
  ) => (
    <TextField
      key={field}
      fullWidth
      label={label}
      type={type}
      required={required}
      error={Boolean(errors[field])}
      helperText={errors[field]?.message ?? ""}
      {...register(field, {
        validate: (value) => {
          if (required && !value.trim()) {
            return `${label} is required`;
          }

          if (
            field === "email" &&
            value.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ) {
            return "Enter a valid email address";
          }

          if (
            field === "email" &&
            employees.some(
              (employee) =>
                employee.email.toLowerCase() === value.trim().toLowerCase() &&
                employee.id !== editingEmployee?.id,
            )
          ) {
            return "This email is already in use";
          }

          return true;
        },
      })}
    />
  );

  // Reusable select field

  const renderSelectField = (
    field: SelectFieldName,
    label: string,
    required = false,
  ) => (
    <Controller
      key={field}
      name={field}
      control={control}
      rules={{
        validate: (value) =>
          !required || value ? true : `Please select a ${label.toLowerCase()}`,
      }}
      render={({ field: controllerField }) => (
        <TextField
          {...controllerField}
          select
          fullWidth
          required={required}
          label={label}
          error={Boolean(errors[field])}
          helperText={errors[field]?.message ?? ""}
        >
          {field === "division" && <MenuItem value="">None</MenuItem>}

          {options[field].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );

  // Password fields

  const renderPasswordField = (
    field: "password" | "confirmPassword",
    label: string,
    visible: boolean,
    toggleVisibility: () => void,
  ) => (
    <TextField
      key={field}
      fullWidth
      required
      label={label}
      type={visible ? "text" : "password"}
      autoComplete="new-password"
      error={Boolean(errors[field])}
      helperText={errors[field]?.message ?? ""}
      {...register(field, {
        validate: (value) => {
          if (!editingEmployee && !value) {
            return field === "password"
              ? "Password is required"
              : "Please re-enter your password";
          }

          if (field === "password" && value && value.length < 8) {
            return "Password must be at least 8 characters";
          }

          if (field === "confirmPassword" && value !== getValues("password")) {
            return "Passwords do not match";
          }

          return true;
        },
      })}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                aria-label={visible ? "Hide password" : "Show password"}
                onClick={toggleVisibility}
                edge="end"
              >
                {visible ? <VisibilityOffRounded /> : <VisibilityRounded />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );

  // Save employee

  const handleSave = (form: EmployeeForm) => {
    const currentDate = today();

    const employeeData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      role: form.role,
      company: form.company,
      department: form.department,
      division: form.division,
      address: form.address.trim(),
      mobile: form.mobile.trim(),
      landline: form.landline.trim(),
    };

    if (editingEmployee) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editingEmployee.id
            ? {
                ...employee,
                ...employeeData,
                isDisabled: form.isDisabled,
                isVerified: form.isVerified,
                modified: currentDate,
              }
            : employee,
        ),
      );
    } else {
      const newEmployee: Employee = {
        ...employeeData,
        id: Math.max(0, ...employees.map((employee) => employee.id)) + 1,
        isDisabled: false,
        isVerified: false,
        created: currentDate,
        modified: currentDate,
      };

      setEmployees((previous) => [...previous, newEmployee]);
    }

    closeForm();
  };

  // Delete employee

  const openDeleteDialog = (employee: Employee) => {
    setDeletingEmployee(employee);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    setDeletingEmployee(null);
  };

  const confirmDelete = () => {
    if (!deletingEmployee) return;

    setEmployees((previous) =>
      previous.filter((employee) => employee.id !== deletingEmployee.id),
    );

    closeDeleteDialog();
  };

  // Reusable status badge

  const renderStatusBadge = (
    value: boolean,
    trueLabel: string,
    falseLabel: string,
    trueClass: string,
    falseClass: string,
  ) => (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${
        value ? trueClass : falseClass
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );

  return (
    <main className="min-h-screen bg-green-50 p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        {/* Heading and filters */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manage Employee
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* <Tooltip title="Employee Record">
              <button
                type="button"
                onClick={openAddForm}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <Edit className="bg-red-500 size-10 hover:bg-green-900"  fontSize="small" />
                Add Employee
              </button>
            </Tooltip> */}
            <AddButton onAdd={openAddForm} title="Add Employee"  />

            <Tooltip title="Filter Employee Records">
              <button
                type="button"
                onClick={() => setFilterOpen((previous) => !previous)}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <FilterListRounded
                  fontSize="small"
                  className="text-slate-500"
                />
                Filter
              </button>
            </Tooltip>
          </div>

          {filterOpen && (
            <div className="mt-4 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <TextField
                size="small"
                label="Search employees"
                placeholder="Name, email, department..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="min-w-40"
              >
                <MenuItem value="all">All employees</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="disabled">Disabled</MenuItem>
              </TextField>
            </div>
          )}
        </div>

        {/* Employee table */}

        <div className="space-y-4">
          <div className="flex items-center justify-between pt-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Employee Table
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredEmployees.length} of {employees.length}{" "}
                employee records
              </p>
            </div>
          </div>

          <TableContainer
            component={Paper}
            elevation={0}
            className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm"
          >
            <Table
              aria-label="Employee management table"
              className="min-w-[1550px]"
            >
              <TableHead className="bg-slate-50">
                <TableRow>
                  {tableHeadings.map((heading) => (
                    <TableCell
                      key={heading}
                      align={heading === "Action" ? "right" : "left"}
                      className="whitespace-nowrap py-4 text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody className="bg-white text-sm text-slate-700">
                {filteredEmployees.map((employee, index) => (
                  <TableRow
                    key={employee.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <TableCell className="py-4 pl-6 font-medium text-slate-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-4 font-medium text-slate-900">
                      {employee.firstName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-4 font-medium text-slate-900">
                      {employee.lastName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-4">
                      {employee.department}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-4">
                      {employee.division || "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-4">
                      {employee.address || "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-4 font-mono">
                      {employee.mobile}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-4 font-mono">
                      {employee.landline || "—"}
                    </TableCell>
                    <TableCell className="py-4">{employee.email}</TableCell>
                    <TableCell className="whitespace-nowrap py-4">
                      {employee.role}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-4">
                      {employee.company}
                    </TableCell>
                    <TableCell className="py-4">
                      {renderStatusBadge(
                        employee.isDisabled,
                        "True",
                        "False",
                        "bg-red-50 text-red-700 ring-red-600/20",
                        "bg-green-50 text-green-700 ring-green-600/20",
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      {renderStatusBadge(
                        employee.isVerified,
                        "Verified",
                        "Unverified",
                        "bg-green-50 text-green-700 ring-green-600/20",
                        "bg-amber-50 text-amber-700 ring-amber-600/20",
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-4 text-xs text-slate-500">
                      {employee.created}
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-4 text-xs text-slate-500">
                      {employee.modified}
                    </TableCell>
                    <TableCell align="right" className="py-4 pr-6">
                      <div className="flex items-center justify-end gap-1">
                        {/* <Tooltip title="Edit Employee">
                          <IconButton
                            size="small"
                            aria-label={`Edit ${employee.firstName}`}
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => openEditForm(employee)}
                          >
                            <EditRounded fontSize="small" />
                          </IconButton>
                        </Tooltip> */}
                        <AddButton
                          onAdd={() => openEditForm(employee)}
                          label="Edit"
                          title="edit employee"
                        />

                        <Tooltip title="Delete Employee">
                          <IconButton
                            size="small"
                            aria-label={`Delete ${employee.firstName}`}
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => openDeleteDialog(employee)}
                          >
                            <DeleteRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={16}
                      align="center"
                      className="py-12 text-slate-500"
                    >
                      No employee records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      {/* Add / Edit dialog */}

      <Dialog
        open={formOpen}
        onClose={closeForm}
        fullWidth
        maxWidth="md"
        scroll="paper"
        aria-labelledby="employee-form-title"
      >
        <DialogTitle
          id="employee-form-title"
          className="flex items-center justify-between border-b border-slate-200 px-6 py-5"
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </h2>
            <p className="mt-1 text-sm font-normal text-slate-500">
              {editingEmployee
                ? "Update the employee details below."
                : "Enter the employee details below."}
            </p>
          </div>

          <IconButton
            type="button"
            aria-label="Close form"
            onClick={closeForm}
            edge="end"
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        <DialogContent className="px-6 py-6">
          <form onSubmit={handleSubmit(handleSave)} noValidate>
            <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2">
              {renderTextField("firstName", "First Name", true)}
              {renderTextField("lastName", "Last Name", true)}
              {renderTextField("email", "Email", true, "email")}

              {renderSelectField("role", "Role", true)}
              {renderSelectField("company", "Company", true)}
              {renderSelectField("department", "Department", true)}
              {renderSelectField("division", "Division")}

              {renderTextField("mobile", "Mobile Number", true)}
              {renderTextField("landline", "Landline Number")}
              {renderTextField("address", "Address")}

              {/* Passwords are only shown when adding */}

              {!editingEmployee && (
                <>
                  {renderPasswordField(
                    "password",
                    "Password",
                    showPassword,
                    () => setShowPassword((previous) => !previous),
                  )}

                  {renderPasswordField(
                    "confirmPassword",
                    "Re-Password",
                    showConfirmPassword,
                    () => setShowConfirmPassword((previous) => !previous),
                  )}
                </>
              )}

              {/* Status controls are only shown when editing */}

              {editingEmployee && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                  <h3 className="mb-3 text-sm font-semibold text-slate-800">
                    Employee Status
                  </h3>

                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <Controller
                      name="isDisabled"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                              color="error"
                            />
                          }
                          label={
                            <span className="text-sm text-slate-700">
                              Is Disabled
                            </span>
                          }
                        />
                      )}
                    />

                    <Controller
                      name="isVerified"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                              color="success"
                            />
                          }
                          label={
                            <span className="text-sm text-slate-700">
                              Is Verified
                            </span>
                          }
                        />
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                onClick={closeForm}
                className="normal-case"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                className="bg-blue-600 normal-case shadow-none hover:bg-blue-700"
              >
                {editingEmployee ? "Save Changes" : "Save Employee"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={closeDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle className="flex items-center justify-between">
          Delete Employee
          <IconButton
            type="button"
            aria-label="Close delete dialog"
            onClick={closeDeleteDialog}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to delete{" "}
            <strong>
              {deletingEmployee
                ? `${deletingEmployee.firstName} ${deletingEmployee.lastName}`
                : "this employee"}
            </strong>
            ? This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end gap-3 pb-2">
            <Button
              variant="outlined"
              color="inherit"
              onClick={closeDeleteDialog}
              className="normal-case"
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={confirmDelete}
              className="normal-case shadow-none"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
