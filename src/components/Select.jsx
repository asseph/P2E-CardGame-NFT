import * as SelectPrimitive from "@radix-ui/react-select";

const Select = ({ state, setState, name, items, className }) => {
	return (
		<SelectPrimitive.Root
			value={state}
			onValueChange={(s) => {
				setState(s);
			}}
		>
			<SelectPrimitive.Trigger
				className={`h-11 w-24 rounded-xl bg-[#393869] px-4 py-1 font-semibold text-light ${className}`}
				aria-label="Token"
			>
				<SelectPrimitive.Value placeholder={`${name}...`}>
					{state}
				</SelectPrimitive.Value>
			</SelectPrimitive.Trigger>
			<SelectPrimitive.Content className="w-24 rounded-lg bg-[#393869] p-1 font-semibold text-light">
				<SelectPrimitive.Viewport>
					<SelectPrimitive.Group>
						{items.map((i) => {
							return (
								<SelectPrimitive.Item
									className="
                                    grid h-9
                                    cursor-pointer place-content-center 
                                    rounded-lg transition hover:bg-[#6E6FA6]"
									value={i}
									key={i}
								>
									<SelectPrimitive.ItemText>
										{i}
									</SelectPrimitive.ItemText>
								</SelectPrimitive.Item>
							);
						})}
					</SelectPrimitive.Group>
				</SelectPrimitive.Viewport>
			</SelectPrimitive.Content>
		</SelectPrimitive.Root>
	);
};

export default Select;
