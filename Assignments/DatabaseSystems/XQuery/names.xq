<names>{
    for $author in /bib/book[price > 20]/author
    group by $last := $author/last, $first := $author/first
    return (<last>{$last}</last>, <first>{$first}</first>)
}</names>

