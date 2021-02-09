import React, { useEffect, useState } from "react";

import useNonPersistentFilter from "../../../filters/FilterCtx/useNonPersistentFilter";
import {
    orderBy,
    fromPairs,
    map,
    forEach,
    find,
    filter as lodashFilter,
} from "lodash";

import { useKGCtx } from "../../../knowledgegraph/KGCtx/useKGCtx";
import { Icon } from "semantic-ui-react";

const stringSimilarity = require("string-similarity");

/**
 * @description Filter data
 * @author Christian Colonna
 * @date 29-11-2020
 * @export
 * @param {[{ label : string, count : number, color : string, uri : string
 * }]} {Object[]} { properties } label: Property label, count: number of instances, color: color
 * @param {function} onFilter callback is called every time change filtered array,
 *                            it receives as argument the array of element filtered out.
 *                            Array contains index of the element as it passed as input to the filter.
 * @returns {JSX.Element}
 */
export default function SearchBarFilter({
    searchBarPlaceholder = "Search in the table",
    threshold = 0.15,
    id = "search",
}) {
    const { knowledgeGraph } = useKGCtx();
    const resources = knowledgeGraph.getResources();
    const filterCallback = (pattern) => {
        if (search === "") {
            return true;
        }
        if (search !== "") {
            // apply effect only after 3 seconds the user stopped typing
            const result = stringSimilarity.findBestMatch(
                search.toLowerCase(),
                map(resources, (resource) => {
                    // concatenate list values inside label
                    // node.id will be used to split and create an index
                    let propsChain = "";
                    forEach(resource.getProperties(), (p) => {
                        if (typeof p !== "undefined") {
                            propsChain += `${p} `;
                        }
                    });
                    propsChain = propsChain.toLowerCase();
                    return propsChain;
                })
            );
            // if string exact match of a substring set ratings to 1
            result.ratings.forEach((r) => {
                if (r.target.toLowerCase().includes(search.toLowerCase())) {
                    r.rating = 1;
                }
            });
            const index = fromPairs(
                map(result.ratings, (x, i) => [
                    x.target.split(" ")[0],
                    x.rating,
                ])
            );
            const filteredResources = lodashFilter(resources, (r) => {
                if (index[r.getUri()] >= threshold) return r;
            });

            if (
                find(filteredResources, (f) => {
                    return f.getUri() === pattern.getUri();
                })
            ) {
                return true;
            }
            // const sorted = orderBy(filtered, (x) => index[x.id], ["desc"]);
        }
    };

    const initialFilterOptions = {
        active: true,
        filterCallback: filterCallback,
    };
    const { filter, setFilterOptions } = useNonPersistentFilter(
        id,
        initialFilterOptions
    );

    const [search, setSearch] = useState(
        (filter && filter.getOption("search")) || ""
    );

    useEffect(() => {
        // set a delay after a user modify input before updating filtering
        const delayDebounceFn = setTimeout(() => {
            if (filter) {
                setFilterOptions({
                    ...filter.options,
                    active: true,
                    search: search,
                    filterCallback: filterCallback,
                });
            }
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleInput = (event) => {
        setSearch(event.target.value);
    };

    return (
        <div>
            <Icon name="search" className="search-icon"></Icon>
            <input
                className="search-item"
                placeholder={searchBarPlaceholder}
                onChange={handleInput}
            ></input>
        </div>
    );
}
