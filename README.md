# Tanstack Query Visualizer

A web app for visualizing and experimenting with TanStack Query keys, queries, and mutations.

## Setup
The queries are with the default settings:
```
useQuery({ queryKey: queryItem.queryKey });
```
The mutations will invalidate the keys after a "successful" mutation:
```
useMutation({
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: queryItem.queryKey,
      });
    },
});
```
