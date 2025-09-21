

It's fine to say "this algorithm is more efficient than that algorithm", but can we be more specific than that? Can we quantify things and say _how much_ more efficient the algorithm is?

Here they are next to each other for comparison:

`def some_function(n):     for i in range(2):         n += 100     return n def other_function(n):     for i in range(100):         n += 2     return n`

Although the two functions have the exact same end result, one of them iterates many times to get to that result, while the other iterates only a couple of times.

This was admittedly a rather impractical example (you could skip the `for` loop altogether and just add `200` to the input), but it nevertheless demonstrates one way in which [[efficiency]] can come up.

## Counting lines

With the above examples, what we basically did was count the number of lines of code that were executed. Let's look again at the first function:

`def some_function(n):     for i in range(2):         n += 100     return n`

There are four lines in total, but the line inside the `for` loop will get run twice. So running this code will involve running _5 lines_.

Now let's look at the second example:

`def other_function(n):     for i in range(100):         n += 2     return n`

In this case, the code inside the loop runs 100 times. So running this code will involve running _103 lines_!

Counting lines of code is _not_ a perfect way to quantify [[efficiency]], and we'll see that there's a lot more to it as we go through the program. But in this case, it's an easy way for us to approximate the difference in [[efficiency]] between the two solutions. We can see that if Python has to perform an addition operation 100 times, this will certainly take longer than if it only has to perform an addition operation twice!