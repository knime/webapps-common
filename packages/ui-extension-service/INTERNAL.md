# Development Structure

## Service hierarchy

```
    ~Top-Level Workflow/Project *services*~
        1.) `NodeService`
            - 1 per context
            - implemented by framework
            - methods target specific level-2 services
            - METHODS:
                a.) `.callNodeDataService(<RPC request>)`
                    2.) `DataService` (Node-Instance-level)
                        - implemented by individual Node
                        - defined by `NodeService` framework
                        - METHODS (*defined by DataService):
                            a.) `APPLY_DATA/Apply Data/apply_data ~(PUT)`*
                            b.) `DATA/Data/data ~(POST)`*
                                - has sub-functionality
                                - METHODS:
                                    a.) `getData` (`NodeService.callNodeDataService() -> DataService.DATA() -> getData()`)
                                    b?.) `customData` (`NodeService > DataService.DATA > custom data`)
                            c.) INIT_DATA/Init Data/init_data ~(GET)*
                            d?.) `CUSTOM_DATA_SERVICE_METHOD`
                b.) `.selectDataPoint(<RPC request>)`
                    2.) `SelectionService` (Node-Instance-level)
                        -> ...
                c?.) `.targetCustomService`
                    2.) `CustomService` (Node-Instance-level)
                        -> ...
        1.) <Other, internal top-level services>
            ...
```
