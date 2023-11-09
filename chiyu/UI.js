function instant_text(string, size, x, y, colour = color(0), middle = false)
{
    noSmooth()
    textSize(size)
    fill(colour)
    strokeWeight(0)
    var offX = 0;
    if(middle){offX = textWidth(string)/2}
    text(string, x - offX, y + textAscent())
    fill(255)
    smooth()
}


class label
{
    constructor(text_value, position_x, position_y, size, color, time_offset = 0)
    {
        this.text = text_value
        this.text_size = size
        this.x = position_x
        this.y = position_y
        this.col = color
        this.externalAlpha = 0;
        this.lifetime = -time_offset
    }

    render()
    {
        var alpha = Math.min(1, this.lifetime);
        alpha = Math.max(0, alpha)
        this.externalAlpha = alpha*this.col[3]*255;
        instant_text(this.text, this.text_size, this.x, this.y, color(this.col[0], this.col[1], this.col[2], this.externalAlpha), true);
        this.lifetime += 3*deltaTime/1000;
    }
}