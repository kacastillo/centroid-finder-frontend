import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// base from ai - A higher-order component (HOC): a function that takes a component and returns a new one.
// The new component shows a spinner while `loading` is true and an error message if
// `error` is set. Otherwise it shows the original component with the remaining props.
// The wrapped component never sees `loading` or `error`.

export default function withLoading(WrappedComponent) {
  function WithLoading({ loading, error, ...props }) {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress aria-label="Loading" />
        </Box>
      );
    }
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    return <WrappedComponent {...props} />;
  }

  WithLoading.displayName = `withLoading(${WrappedComponent.name || "Component"})`;
  return WithLoading;
}